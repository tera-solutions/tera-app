import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
    ],
    server: {
      port: 3001,
      strictPort: true,
      fs: {
        allow: [".."],
      },
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        pages: path.resolve(__dirname, "./src/pages/"),
        styles: path.resolve(__dirname, "./src/styles/"),
        routers: path.resolve(__dirname, "./src/routers/"),
        states: path.resolve(__dirname, "./src/states/"),
        _common: path.resolve(__dirname, "./src/_common/"),
        "@tera/commons": path.resolve(__dirname, "../../packages/commons/src"),
        "@tera/components": path.resolve(
          __dirname,
          "../../packages/components/src",
        ),
        "@tera/assets": path.resolve(__dirname, "../../packages/assets/src"),
        "@tera/themes": path.resolve(__dirname, "../../packages/themes/src"),
        "@tera/stores": path.resolve(__dirname, "../../services/stores/src"),
        "@tera/api": path.resolve(__dirname, "../../services/api/src"),
        "@tera/modules": path.resolve(
          __dirname,
          "../../services/modules/src",
        ),
        "tailwind-merge.config": path.resolve(
          __dirname,
          "./src/tailwind-merge.config.ts",
        ),
        "~": path.resolve(__dirname, "./"),
        "@": path.resolve(__dirname, "./src/"),
        src: path.resolve(__dirname, "./src/"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
          quietDeps: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        "@tanstack/react-query",
        "react-chartjs-2",
        "chart.js",
        "mobx-persist-store",
        "react"
      ],
      exclude: ["tera-dls"],
    },
    define: {
      "process.env": env,
    },
  };
});
