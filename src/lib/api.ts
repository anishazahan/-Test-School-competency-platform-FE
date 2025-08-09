"use client"

import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react"
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import type { RootState } from "./store"
import type {
  User,
  Tokens,
  Pagination,
  UserListItem,
  Question,
  ExamStatusResponse,
  StartStepResponse,
  GetQuestionsResponse,
  SubmitStepRequest,
  SubmitStepResponse,
  Certificate,
} from "./types"
import { setTokens } from "./slices/auth-slices"

// Create a shared axios instance per base URL
function makeAxios(baseURL: string): AxiosInstance {
  const instance = axios.create({ baseURL, withCredentials: true })
  return instance
}

type BaseArgs = {
  url: string
  method: AxiosRequestConfig["method"]
  data?: unknown
  params?: unknown
  headers?: Record<string, string | undefined>
}

// Axios-powered base query that:
// - attaches Authorization header from Redux
// - retries once on 401 after refresh
const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }): BaseQueryFn<BaseArgs, unknown, { status?: number; data?: any }> =>
  async (args, { getState, dispatch, signal }) => {
    const { url, method, data, params, headers } = args
    const state = getState() as RootState
    const access = state.auth.tokens?.accessToken
    const instance = makeAxios(baseUrl)

    try {
      const res = await instance.request({
        url,
        method,
        data,
        params,
        headers: { ...(headers ?? {}), Authorization: access ? `Bearer ${access}` : undefined },
        signal,
      })
      return { data: res.data }
    } catch (e) {
      const err = e as AxiosError
      if (err.response?.status === 401) {
        try {
          const refreshRes = await instance.post("/auth/refresh", {}, { signal })
          const newTokens: { tokens: Tokens } = refreshRes.data
          dispatch(setTokens(newTokens.tokens))
          const retry = await instance.request({
            url,
            method,
            data,
            params,
            headers: { ...(headers ?? {}), Authorization: `Bearer ${newTokens.tokens.accessToken}` },
            signal,
          })
          return { data: retry.data }
        } catch (refreshErr: any) {
          return { error: { status: refreshErr.response?.status, data: refreshErr.response?.data } }
        }
      }
      return { error: { status: err.response?.status, data: err.response?.data ?? err.message } }
    }
  }

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api" }),
  tagTypes: ["User", "Question", "Exam", "Certificate"],
  endpoints: (build) => ({
    // Auth
    register: build.mutation<{ message: string }, { name: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", data: body }),
    }),
    verifyOtp: build.mutation<{ message: string }, { email: string; otp: string }>({
      query: (body) => ({ url: "/auth/verify-otp", method: "POST", data: body }),
    }),
    resendOtp: build.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/resend-otp", method: "POST", data: body }),
    }),
    login: build.mutation<{ user: User; tokens: Tokens }, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", data: body }),
    }),
    forgotPassword: build.mutation<{ message: string }, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", data: body }),
    }),
    resetPassword: build.mutation<{ message: string }, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", data: body }),
    }),
    logout: build.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),

    // Admin lists
    listUsers: build.query<Pagination<UserListItem>, { page: number; limit: number }>({
      query: ({ page, limit }) => ({ url: "/admin/users", method: "GET", params: { page, limit } }),
      providesTags: ["User"],
    }),
    listQuestions: build.query<Pagination<Question>, { page: number; limit: number }>({
      query: ({ page, limit }) => ({ url: "/questions", method: "GET", params: { page, limit } }),
      providesTags: ["Question"],
    }),
    createQuestion: build.mutation<
      Question,
      { level: Question["level"]; competency: string; text: string; choices: string[]; correctIndex: number }
    >({
      query: (body) => ({ url: "/questions", method: "POST", data: body }),
      invalidatesTags: ["Question"],
    }),

    // Exam
    getExamStatus: build.query<ExamStatusResponse, void>({
      query: () => ({ url: "/exams/status", method: "GET" }),
      providesTags: ["Exam"],
    }),
    startStep: build.mutation<StartStepResponse, void>({
      query: () => ({ url: "/exams/start", method: "POST" }),
      invalidatesTags: ["Exam"],
    }),
    getStepQuestions: build.query<GetQuestionsResponse, string | null>({
      query: (step) => ({ url: "/exams/questions", method: "GET", params: { step } }),
    }),
    submitStep: build.mutation<SubmitStepResponse, SubmitStepRequest>({
      query: (body) => ({ url: "/exams/submit", method: "POST", data: body }),
      invalidatesTags: ["Exam", "Certificate"],
    }),

    // Certificates
    myCertificates: build.query<{ items: Certificate[] }, void>({
      query: () => ({ url: "/certificates/my", method: "GET" }),
      providesTags: ["Certificate"],
    }),
  }),
})

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useListUsersQuery,
  useListQuestionsQuery,
  useCreateQuestionMutation,
  useGetExamStatusQuery,
  useStartStepMutation,
  useGetStepQuestionsQuery,
  useSubmitStepMutation,
  useMyCertificatesQuery,
} = api
