# Feature Specification
# Intelligent Ingredient Normalization & Search

## Author

Senior Software Engineer

---

# Problem Statement

The current ingredient system relies on exact string matching.

This causes several long-term problems:

- Duplicate ingredients
    - "Tomato"
    - "tomatoes"
    - "roma tomato"
    - "fresh tomato"

- Misspellings create new ingredients
    - "tomatoe"

- Different wording represents the same concept
    - "ground beef"
    - "minced beef"

- Searches miss valid recipes because ingredient names don't exactly match.

As the database grows, these problems compound and eventually make searching unreliable and maintaining the ingredient database expensive.

The goal of this feature is to build an intelligent ingredient normalization pipeline that:

1. Prevents duplicate ingredients.
2. Organizes ingredients into a taxonomy.
3. Uses fuzzy matching before creating new ingredients.
4. Uses an LLM only when traditional matching cannot confidently determine the result.
5. Makes ingredient searching significantly more forgiving.

---

# High-Level Goals

The system should:

- maintain one canonical ingredient record
- optionally support aliases later
- organize ingredients into categories
- intelligently normalize user input
- improve recipe search accuracy
- minimize unnecessary LLM requests

---

# Architecture Overview

```
User enters ingredient
        │
        ▼
Normalize text
(lowercase, trim, punctuation)
        │
        ▼
Exact Match
        │
   Found? ───────────────► Use ingredient
        │
        ▼
Fuzzy Match
        │
High confidence?
        │
   Yes ───────────────► Use ingredient
        │
        ▼
LLM Classification
        │
        ▼
Existing ingredient?
      /      \
    Yes      No
    │         │
Use ID    Create Ingredient
              │
              ▼
Assign Parent Category
```

---

# Taxonomy

Ingredients should exist inside a hierarchy.

Example

```
Produce
├── Vegetables
│   ├── Tomato
│   ├── Onion
│   ├── Garlic
│   └── Bell Pepper
│
├── Fruits
│   ├── Apple
│   ├── Lemon
│   └── Lime
│
Proteins
├── Beef
│   ├── Ground Beef
│   └── Steak
│
├── Chicken
└── Pork

Dairy
├── Milk
├── Butter
└── Cheese

Spices
├── Salt
├── Pepper
├── Paprika
└── Cumin

Oils
├── Olive Oil
└── Vegetable Oil
```

This hierarchy should remain editable by administrators.

---

# Database Changes

## ingredient

Current

```
ingredient_id
ingredient_name
```

Proposed

```
ingredient_id
ingredient_name
parent_id
category
created_by
created_at
normalized_name
```

Where

- normalized_name is lowercase
- punctuation removed
- singularized if applicable

Example

```
Ingredient Name      normalized_name

Tomatoes             tomato
Tomato               tomato
Roma Tomato          roma tomato
```

---

# Future Table (Optional)

```
ingredient_alias

id
ingredient_id
alias
normalized_alias
```

Example

```
Ground Beef
Hamburger Meat
Minced Beef
```

All map to one canonical ingredient.

This is intentionally deferred until later.

---

# Ingredient Creation Pipeline

Whenever a user submits a recipe:

```
For each ingredient

↓

Normalize text

↓

Exact Match

↓

If found
    return ingredient

↓

Fuzzy Match

↓

If confidence >= threshold

    return ingredient

↓

LLM Classification

↓

If LLM believes
ingredient already exists

    use existing ingredient

Else

    create ingredient

    assign category

    assign parent
```

---

# Normalization

Before any matching:

Convert

```
Lowercase

Trim whitespace

Collapse repeated spaces

Remove punctuation

Remove unnecessary descriptors

Optional singularization
```

Example

```
"  Tomatoes "

↓

tomato

"Fresh Garlic"

↓

garlic

"Extra Virgin Olive Oil"

↓

extra virgin olive oil
```

---

# Exact Match

Fast database lookup.

```
WHERE normalized_name = input
```

If found

Done.

---

# Fuzzy Matching

Only runs after exact match fails.

Possible libraries

JavaScript

- Fuse.js
- Fast-Fuzzy

Postgres

- pg_trgm

Similarity examples

```
tomato

tomatoes

tomatoe

tomto

roma tomato
```

Configurable threshold

Example

```
Similarity >= 0.90

Accept

Similarity < 0.90

Continue
```

---

# LLM Classification

The LLM should only be called after:

- exact match fails
- fuzzy match fails

Prompt example

```
The user submitted:

"roma tomatoes"

Existing ingredients:

Tomato
Onion
Garlic
Bell Pepper
Roma Tomato

Question:

Does this ingredient match an existing ingredient?

If yes:

Return the existing ingredient.

If no:

Suggest:

1. canonical ingredient name

2. parent category

3. confidence
```

Expected response

```
{
    "match": true,
    "ingredient": "Roma Tomato",
    "confidence": 0.96
}
```

or

```
{
    "match": false,
    "canonical_name": "Black Garlic",
    "parent": "Garlic",
    "category": "Produce"
}
```

---

# Creating New Ingredients

If no match exists

Create

```
ingredient

ingredient_name

normalized_name

parent

category
```

No duplicate creation should occur without passing through this pipeline.

---

# Search Pipeline

Searching should be more forgiving than creation.

Pipeline

```
User Search

↓

Normalize

↓

Exact Match

↓

Results?

Yes

Return

↓

No

↓

Fuzzy Match

↓

Results?

Yes

Return

↓

No

↓

LLM Semantic Search

↓

Return likely ingredients

↓

Return recipes
```

---

# Search Examples

User types

```
tomatoes
```

Returns

```
Tomato
```

---

User types

```
tomatoe
```

Returns

```
Tomato
```

---

User types

```
hamburger meat
```

Future

```
Ground Beef
```

---

User types

```
red onion
```

Returns

```
Red Onion
```

or

```
Onion
```

depending on taxonomy.

---

# Performance Considerations

LLM calls are expensive.

Priority should always be

```
Exact Match

↓

Fuzzy Match

↓

LLM
```

Expected percentages

```
Exact

90-95%

Fuzzy

4-9%

LLM

<1%
```

This minimizes latency and API cost.

---

# Future Enhancements

## Ingredient Aliases

```
Hamburger Meat

↓

Ground Beef
```

---

## Ingredient Embeddings

Store vector embeddings.

Enable semantic search without repeatedly calling an LLM.

---

## Admin Review Queue

Instead of automatically creating ingredients

Unknown ingredients can enter

```
Pending Review
```

Administrators approve

Merge

Reject

Rename

Assign parent

---

## Automatic Taxonomy Suggestions

The LLM can periodically suggest

- merges
- duplicate ingredients
- misplaced categories

---

# User Stories

## Story 1

As a recipe creator

I want ingredient names automatically normalized

so duplicate ingredients are not created.

---

## Story 2

As a user

I want spelling mistakes to still find recipes

so searches feel forgiving.

---

## Story 3

As an administrator

I want ingredients organized into categories

so the database remains maintainable.

---

## Story 4

As a user

I want new ingredients intelligently categorized

so the ingredient list stays organized.

---

## Story 5

As a developer

I want the LLM used only as a fallback

so infrastructure costs remain low.

---

# Acceptance Criteria

- Exact matching occurs first.
- Fuzzy matching occurs second.
- LLM is only called when needed.
- New ingredients receive a parent category.
- Duplicate ingredients are prevented.
- Search tolerates misspellings.
- Search tolerates pluralization.
- Taxonomy is editable.
- Ingredient normalization is reusable.
- All matching logic is centralized into a single service.

---

# Suggested Development Order

## Phase 1

- Database normalization column
- Normalization utility
- Exact matching

---

## Phase 2

- Fuzzy matching
- Similarity threshold
- Unit tests

---

## Phase 3

- Taxonomy tables
- Parent relationships
- Category management

---

## Phase 4

- LLM ingredient classifier
- New ingredient creation
- Parent assignment

---

## Phase 5

- Intelligent search
- Ranking
- Performance optimization

---

# Definition of Done

The feature is considered complete when:

- Users can submit ingredients with natural wording.
- Duplicate ingredients are rarely created.
- Searches tolerate misspellings.
- Searches tolerate pluralization.
- Every ingredient belongs within a taxonomy.
- The LLM is used only as a fallback.
- Ingredient normalization is reusable across recipe creation, editing, and searching.