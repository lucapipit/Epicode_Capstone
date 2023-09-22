import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    //add post
    categories: [],
    currentPage: 1,
    //view posts
    allPosts: [],
    filteredPosts: [],
    singlePost: {
        singlePost: {
            _id: "650977cd4d49c196c3870edf",
            title: "loading...",
            subtitle: "loading...",
            text: "loading...",
            img: "d09580ff-77e0-4749-9702-ff6dec118f8b.jpg",
            author: {
                _id: "64e75c8f1ea601a7a0eac5da",
                name: "Luca Maria",
                surname: "Pipitone",
                email: "pipitonelucamaria@gmail.com",
                password: "$2b$10$xEYI3rgRyalL28i8J/Re..V/gLE3bIjmVwlW/JYsE40cgZErsaOz2",
                dob: "2023-08-24",
                avatar: "Luca Maria Pipitone",
                authorImg: "https://lh3.googleusercontent.com/a/AAcHTtdXxvCG3jIEu4vcEE07jz5fk0DVjs5DvSQJnvJ5I9q6=s96-c",
                createdAt: "2023-08-24T13:35:11.584Z",
                updatedAt: "2023-08-24T13:35:11.584Z",
                __v: 0
            }
        }
    },
    pageSize: 6,
    numberOfPages: null,
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
    async (input) => {
        const apiUrl = `${process.env.REACT_APP_SERVERBASE_URL}/posts`;
        try {

            const response = await fetch(!input ? apiUrl : apiUrl + `?page=${input.toString()}`, {
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
            state.numberOfPages = action.payload.length / state.pageSize;
            state.filteredPosts = action.payload
        },
        updateSearchKey: (state, action) => {
            state.markSearchKey = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        /* GET ALL POSTS */
        builder.addCase(getAllPostsFunc.pending, (state, action) => {
            state.isLoading = true
        });
        builder.addCase(getAllPostsFunc.fulfilled, (state, action) => {
            state.isLoading = false;
            state.allPosts = action.payload.payload;//viene riempito all'avvio dell'applicazione e rimane tale anche in seguito alle operazioni di ricerca
            state.filteredPosts = action.payload.payloadPaged;//viene riempito all'avvio dell'applicazione e viene modificato in seguito alle operazioni di ricerca --> reducer: filteredPosts
            state.pageSize = action.payload.pageSize;
            state.numberOfPages = action.payload.postsCount / state.pageSize
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
            state.filteredPosts = action.payload.payload
        });
        builder.addCase(getPostByCategoryFunc.rejected, (state, action) => {
            state.isLoading = false;
            state.error = "errore nella GET dei posts";
            console.log(state.error)
        });
    }
});

export const { addCategory, clearCategories, toogleOpenModal, selectTags, filterPosts, updateSearchKey, setCurrentPage } = postSlice.actions;
export default postSlice.reducer;
export { getAllPostsFunc, getPostByIdFunc, getPostByCategoryFunc }