import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { describe, it, expect, vi } from 'vitest';

// Mock the custom hook
vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => ({ 
        login: vi.fn().mockResolvedValue({ success: true }),
        loading: false,
        error: null,
    }),
}));


describe('Login Component', () => {
    it('renders login form', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        expect(screen.getByPlaceholderText('Enter your username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('updates input fields', () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        const usernameInput = screen.getByPlaceholderText('Enter your username');
        const passwordInput = screen.getByPlaceholderText('Enter your password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });
});
