"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ExamState = {
  currentStep: "STEP_1" | "STEP_2" | "STEP_3" | null
  dueAt: string | null
  answers: Record<string, string>
}

const initialState: ExamState = {
  currentStep: null,
  dueAt: null,
  answers: {},
}

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExamLocalState(state, action: PayloadAction<Partial<ExamState>>) {
      Object.assign(state, action.payload)
    },
    setAnswer(state, action: PayloadAction<{ qid: string; choiceId: string }>) {
      state.answers[action.payload.qid] = action.payload.choiceId
    },
    clearExamLocalState(state) {
      state.currentStep = null
      state.dueAt = null
      state.answers = {}
    },
  },
})

export const { setExamLocalState, setAnswer, clearExamLocalState } = examSlice.actions
export default examSlice.reducer
