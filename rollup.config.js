import typescript from "rollup-plugin-typescript2"; 
export default { 
    input: "src/index.ts", 
    output: { 
        file: "dist/mizzy.js", 
        format: "umd",
        name: "mizzy" 
    }, plugins: [typescript()] };
