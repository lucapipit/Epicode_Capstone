import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    //add post
    categories: [],
    //view posts
    allPosts: [],
    filteredPosts: [],
    singlePost: {},
    isLoading: false,
    error: "",
    selectedTags: [],
    //edit modal
    isModalOpen: false,
    //search engine
    markSearchKey: ""
};

const getAllPostsFunc = createAsyncThunk(//GET ALL POSTS
    "getAllPosts/fetchGetAllPosts",
    async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_SERVERBASE_URL}/posts`, {
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
const getPostByCategoryFunc = createAsyncThunk(//GET POST BY CATEGORY
    "getPostByCategory/fetchGetPostByCategory",
    async (input) => {
        try {
            const paramFunc = async () => {
                let finalSearch = ""
                input && input.map((el, index) => {

                    if (index + 1 === input.length) { finalSearch += `${el}=${el}` } else { finalSearch += `${el}=${el}&` }

                });
                return finalSearch;
            }
            const myParams = await paramFunc();
            const response = await fetch(`${process.env.REACT_APP_SERVERBASE_URL}/filter?${myParams}`, {
                method: "GET"/* ,
                headers: { "Authorization": "Bearer " + localStorage.getItem("loginData") } */
            });
            console.log(`${process.env.REACT_APP_SERVERBASE_URL}/filter?${paramFunc()}`);
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
        },
        selectTags: (state, action) => {
            state.selectedTags = action.payload
        },
        filterPosts: (state, action) => {
            state.filteredPosts = action.payload
        },
        updateSearchKey: (state, action) => {
            state.markSearchKey = action.payload
        }
    },
    extraReducers: (builder) => {
        /* GET ALL POSTS */
        builder.addCase(getAllPostsFunc.pending, (state, action) => {
            state.isLoading = true
        });
        builder.addCase(getAllPostsFunc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allPosts = action.payload.payload;//viene riempito all'avvio dell'applicazione e rimane tale anche in seguito alle operazioni di ricerca
            state.filteredPosts = action.payload.payload//viene riempito all'avvio dell'applicazione e viene modificato in seguito alle operazioni di ricerca --> reducer: filteredPosts
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
        /* GET POST BY CATEGORY */
        builder.addCase(getPostByCategoryFunc.pending, (state, action) => {
            state.isLoading = true
        });
        builder.addCase(getPostByCategoryFunc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allPosts = action.payload.payload
        });
        builder.addCase(getPostByCategoryFunc.rejected, (state, action) => {
            state.isLoading = false;
            state.error = "errore nella GET dei posts";
            console.log(state.error)
        });
    }
});

export const { addCategory, clearCategories, toogleOpenModal, selectTags, filterPosts, updateSearchKey } = postSlice.actions;
export default postSlice.reducer;
export { getAllPostsFunc, getPostByIdFunc, getPostByCategoryFunc }