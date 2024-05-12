import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import CatDetails from '../../src/components/cats/CatDetails';
import '@testing-library/jest-dom';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';

const mockGetCatById = jest.fn(() => {
    return Promise.resolve({ id: 3, name: "Thecat", age: 12, weight: 2.5 });
});
const mockUpdateCat = jest.fn();

jest.mock('../../src/stores/CatStore', () => ({
    useCatStore: jest.fn(() => ({
        getCatById: mockGetCatById,
        updateCat: mockUpdateCat
    }))
}));

describe('CatDetails', () => {
    it('the details render correctly', async () => {
        render(
            <MemoryRouter initialEntries={[`/cats/3`]}>
                <Routes>
                    <Route
                        path="/cats/:id"
                        element={<CatDetails />}
                    />
                </Routes>
            </MemoryRouter>
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(screen.getByText('Thecat')).toBeInTheDocument();
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });

    it('calls updateCat when updating name', async () => {
        render(
            <MemoryRouter initialEntries={[`/cats/3`]}>
                <Routes>
                    <Route
                        path="/cats/:id"
                        element={<CatDetails />}
                    />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText("openNameInput"));
        await userEvent.type(screen.getByPlaceholderText("New name"), 'Sofia');

        fireEvent.click(screen.getByLabelText("submitName"));

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(mockUpdateCat).toHaveBeenCalled();
    });

    it('calls updateCat when updating age', async () => {
        render(
            <MemoryRouter initialEntries={[`/cats/3`]}>
                <Routes>
                    <Route
                        path="/cats/:id"
                        element={<CatDetails />}
                    />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText("openAgeInput"));
        await userEvent.type(screen.getByLabelText("ageInput"), "21");

        fireEvent.click(screen.getByLabelText("submitAge"));

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(mockUpdateCat).toHaveBeenCalled();
    });
});
