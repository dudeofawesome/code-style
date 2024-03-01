export type ProjectType = 'web-app' | 'backend' | 'cli';
export type Language = 'ts' | 'js' | 'rb' | 'py' | 'css' | 'scss';
export type Technology =
  | 'react'
  | 'react-native'
  | 'nestjs'
  | 'jest'
  | 'vs-code'
  | 'esm'
  | 'commonjs';
export type Builder = 'tsc' | 'esbuild' | 'swc' | 'bun' | 'babel' | 'none';
export type Runtime = 'nodejs' | 'bun';

export interface CodeStyleSetupOptions {
  project_type: ProjectType;
  languages: Language[];
  runtime?: Runtime;
  builder: Builder;
  input_dir?: string;
  output_dir?: string;
  technologies: Technology[];
  library: boolean;
  lenient: boolean;
  overwrite: boolean;
}
