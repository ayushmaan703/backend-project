import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosinstance";
const initialState = {
  loading: false,
  playlist: [],
  playlists: [],
};

export const createPlaylist = createAsyncThunk(
  "createPlaylist",
  async ({ name, description }) => {
    try {
      const response = await axiosInstance.post("/playlist/add-playlist", {
        name,
        description,
      });
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const getUserPlaylists = createAsyncThunk(
  "getUserPlaylists",
  async (userId) => {
    try {
      const response = await axiosInstance.get(`/playlist/user/${userId}`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const addVideoToPlaylist = createAsyncThunk(
  "addVideoToPlaylist",
  async ({ playlistId, videoId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/add/${videoId}/${playlistId}`
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const getPlaylistById = createAsyncThunk(
  "getPlaylistById",
  async (playlistId) => {
    try {
      const response = await axiosInstance.get(`/playlist/g/${playlistId}`);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const deleteVideoFromPlaylist = createAsyncThunk(
  "deleteVideoFromPlaylist",
  async ({ playlistId, videoId }) => {
    try {
      const response = await axiosInstance.patch(
        `/playlist/remove/${videoId}/${playlistId}`
      );
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const deletePlaylist = createAsyncThunk(
  "deletePlaylist",
  async (playlistId) => {
    try {
      const response = await axiosInstance.delete(`/playlist/d/${playlistId}`);
      if (response.data?.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
export const updatePlaylist = createAsyncThunk(
  "updatePlaylist",
  async ({ newName, description, playlistId }) => {
    try {
      const response = await axiosInstance.patch(`/playlist/u/${playlistId}`, {
        newName,
        description,
      });
      if (response.data.success) {
        toast.success(response.data.message);
      }
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      throw error;
    }
  }
);
const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserPlaylists.fulfilled, (state, action) => {
      state.playlists = action.payload;
    });
  },
});
export default playlistSlice.reducer;
