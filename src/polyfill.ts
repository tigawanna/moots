import { getRandomValues } from 'expo-crypto'
import EventSource from "react-native-sse";

globalThis.crypto = globalThis.crypto ?? {}

globalThis.crypto.getRandomValues = (arr) => getRandomValues(arr as any)

globalThis.performance.mark = globalThis.performance.mark ?? (() => {})
globalThis.performance.measure = globalThis.performance.measure ?? (() => {})
globalThis.EventSource = globalThis.EventSource ?? EventSource;
(global as any).EventSource = EventSource;
