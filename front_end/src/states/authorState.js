import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwtDecode from 'jwt-decode';

const initialState = {
    allAuthors: [],
    isAuthorsLoading: false,
    error: "api call has been rejected",
    currentPage: 1,
    author_id: "",
    authorDataTkn: ""
};

const getAllAuthorsFunc = createAsyncThunk(
    "allAuthors/getAllAuthors",
    async (input) => {

        try {
            const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/authors`;
            const response = await fetch(!input ? apiUrl : apiUrl + `?page=${input.toString()}`);
            const data = await response.json();
            return data.author
        } catch (error) {
            console.log(error);
        }
    }
);

const authorSlice = createSlice({
    name: "authorSlice",
    initialState,
    reducers: {
        setIsLoading: (state, action) => {
            console.log("funziono");
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        saveAuthor_id: (state, action) => {
            state.author_id = action.payload._id;
        },
        getUserDatafromToken: (state, action) => {
            const token = localStorage.getItem("loginData");
            if (token) {
                try {
                    const userData = jwtDecode(token, process.env.JWT_SECRET);
                    state.authorDataTkn = userData;
                } catch (error) {
                    console.log(error);
                }
            }
            return
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllAuthorsFunc.fulfilled, (state, action) => {
            state.isAuthorsLoading = false;
            state.allAuthors = action.payload
        });
        builder.addCase(getAllAuthorsFunc.pending, (state, action) => {
            state.isAuthorsLoading = true;
        });
        builder.addCase(getAllAuthorsFunc.rejected, (state, action) => {
            state.isAuthorsLoading = false;
            console.log(state.error);
        })
    }
});

export const { setIsLoading, setCurrentPage, saveAuthor_id, getUserDatafromToken } = authorSlice.actions;
export default authorSlice.reducer;
export { getAllAuthorsFunc }