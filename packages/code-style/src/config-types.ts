export type ProjectType = 'web-app' | 'backend' | 'cli';
export type Language = 'ts' | 'js' | 'rb' | 'py' | 'css' | 'scss';
export type Technology =
  | 'react'
  | 'react-native'
  | 'nextjs'
  | 'nestjs'
  | 'jest'
  | 'vs-code'
  | 'esm'
  | 'commonjs';
export type Builder = 'tsc' | 'esbuild' | 'swc' | 'bun' | 'babel' | 'none';
export type Runtime = 'nodejs' | 'bun' | undefined;

export interface CodeStyleSetupOptions {
  /** The general type of the project. */
  project_type: ProjectType;
  /** Languages that will be used in the project. */
  languages: Language[];
  /** The runtime that will be used. */
  runtime: Runtime;
  /** The builder that will be used. */
  builder: Builder;
  /** The source directory. */
  input_dir?: string;
  /** The build output directory. */
  output_dir?: string;
  /** Any technologies, tools, etc that will be used in this project. */
  technologies: Technology[];
  /** Whether or not this project is a library that other projects will consume. */
  library: boolean;
  /** Whether or not to use lenient rulesets. */
  lenient: boolean;
  /** Whether or not to overwrite files. */
  overwrite: boolean;
}

export interface CodeStyleRCFile extends CodeStyleSetupOptions {
  /** The version of code-style that generated the rc file */
  version: string;
}
