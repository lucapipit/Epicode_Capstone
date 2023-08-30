import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    //add post
    categories: [],
    //view posts
    allPosts: [],
    singlePost: {},
    isLoading: false,
    error: "",
    //edit modal
    isModalOpen: false,
};

const getAllPostsFunc = createAsyncThunk(//GET ALL POSTS
    "getAllPosts/fetchGetAllPosts",
    async () => {
        try {
        
            const response = await fetch( `${process.env.REACT_APP_SERVERBASE_URL}/posts`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("loginData") }
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.log("errore nella chiata GET!!");
        }
    });
const getPostByIdFunc = createAsyncThunk(//GET POST BY ID
    "getPostById/fetchGetPostById",
    async (input) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVERBASE_URL}/posts/${input}`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + localStorage.getItem("loginData") }
            });
            const data = await response.json();
            return data
        } catch (error) {
            console.log("errore nella chiata GET!!");
        }
    });


const postSlice = createSlice({
    name: "postSlice",
    initialState,
    reducers: {
        addCategory: (state, action) => {
            const isDuplicated = () => { return state.categories.includes(action.payload) };
            if (isDuplicated()) {
                return
            }
            state.categories.push(action.payload);
        },
        clearCategories: (state, action) => {
            state.categories = []
        },
        toogleOpenModal: (state, action) => {
            state.isModalOpen = action.payload
        }
    },
    extraReducers: (builder) => {
        /* GET ALL POSTS */
        builder.addCase(getAllPostsFunc.pending, (state, action) => {
            state.isLoading = true
        });
        builder.addCase(getAllPostsFunc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allPosts = action.payload.payload
        });
        builder.addCase(getAllPostsFunc.rejected, (state, action) => {
            state.isLoading = false;
            state.error = "errore nella GET dei posts";
            console.log(state.error)
        });
        /* GET POST BY ID */
        builder.addCase(getPostByIdFunc.pending, (state, action) => {
            state.isLoading = true
        });
        builder.addCase(getPostByIdFunc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.singlePost = action.payload.payload
        });
        builder.addCase(getPostByIdFunc.rejected, (state, action) => {
            state.isLoading = false;
            state.error = "errore nella GET dei posts";
            console.log(state.error)
        });
    }
});

export const { addCategory, clearCategories, toogleOpenModal } = postSlice.actions;
export default postSlice.reducer;
export { getAllPostsFunc, getPostByIdFunc }