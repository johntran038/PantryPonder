import './App.css'

import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function App() {
    const Home = lazy(() => import("./pages/Home"));
    const Login = lazy(() => import("./pages/Login"));
    const Dish = lazy(() => import("./pages/Dish"));
    const Profile = lazy(() => import("./pages/Profile"));
    const CreateDish = lazy(() => import("./pages/CreateDish"));
    const ImageAttributions = lazy(() => import("./pages/ImageAttributions"));
    // const TestParam = lazy(() => import("./pages/TestParam"));
    
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/dish/:id" element={<Dish/>} />
                    <Route exact path="/create-dish" element={<CreateDish/>} />
                    <Route exact path="/:username" element={<Profile/>} />
                    <Route exact path="/image-attributions" element={<ImageAttributions/>} />
                    {/* <Route exact path="/products/test/:param" element={<TestParam/>} /> */}
                </Routes>
            </Suspense>
        </>
    )
}

export default App
