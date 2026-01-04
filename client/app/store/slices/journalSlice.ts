import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { journalAPI, JournalEntry, CreateJournalEntry, JournalStats } from '../../services/api';

interface JournalState {
  entries: JournalEntry[];
  stats: JournalStats | null;
  progress: { avgMood: number; anxietyLevel: number } | null;
  chartData: { entries: any[]; highMood: number; avgMood: number; lowMood: number } | null;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: JournalState = {
  entries: [],
  stats: null,
  progress: null,
  chartData: null,
  isLoading: false,
  isCreating: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (params: { page?: number; limit?: number; mood?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await journalAPI.getEntries(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch entries');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch entries');
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entry: CreateJournalEntry, { rejectWithValue }) => {
    try {
      const response = await journalAPI.createEntry(entry);
      if (response.success) {
        return response.data.entry;
      }
      return rejectWithValue('Failed to create entry');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create entry');
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await journalAPI.deleteEntry(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue('Failed to delete entry');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete entry');
    }
  }
);

export const fetchJournalStats = createAsyncThunk(
  'journal/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await journalAPI.getStats();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch stats');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch stats');
    }
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch entries
    builder.addCase(fetchJournalEntries.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchJournalEntries.fulfilled, (state, action) => {
      state.isLoading = false;
      state.entries = action.payload.entries;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchJournalEntries.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create entry
    builder.addCase(createJournalEntry.pending, (state) => {
      state.isCreating = true;
      state.error = null;
    });
    builder.addCase(createJournalEntry.fulfilled, (state, action) => {
      state.isCreating = false;
      state.entries.unshift(action.payload);
    });
    builder.addCase(createJournalEntry.rejected, (state, action) => {
      state.isCreating = false;
      state.error = action.payload as string;
    });

    // Delete entry
    builder.addCase(deleteJournalEntry.fulfilled, (state, action) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    });

    // Fetch stats
    builder.addCase(fetchJournalStats.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchJournalStats.fulfilled, (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.progress = action.payload.progress;
      state.chartData = action.payload.chartData;
    });
    builder.addCase(fetchJournalStats.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = journalSlice.actions;
export default journalSlice.reducer;

