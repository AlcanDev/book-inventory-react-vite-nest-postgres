export {};
declare global {
  interface Window {
    __COMPONENT_ERROR__?: (error: any, info: any) => void;
  }
}
