"use client";
import { useEffect, useState } from "react";
import { PiSunFill } from "react-icons/pi";
import { PiMoonFill } from "react-icons/pi";
import './index.css';

export default function ThemeChangeButton() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTheme = event.target.value as "light" | "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme); // Salva no localStorage
    };

    useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
    }, [theme]);

    return (
        <div className="theme-container">
            <label className="light-label">
                <input 
                    type="radio" 
                    name="theme" 
                    value="light" 
                    checked={theme === "light"} 
                    onChange={handleChange} 
                />
                <PiSunFill />
            </label>
            <label className="dark-label">
                <input 
                    type="radio" 
                    name="theme" 
                    value="dark" 
                    checked={theme === "dark"} 
                    onChange={handleChange} 
                />
                <PiMoonFill />
            </label>
        </div>
    );
}
