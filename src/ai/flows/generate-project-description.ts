
'use server';
/**
 * @fileOverview Generates a project description using AI.
 *
 * - generateProjectDescription - A function that generates a description for a software project.
 * - GenerateProjectDescriptionInput - The input type for the function.
 * - GenerateProjectDescriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionInputSchema = z.object({
  projectName: z.string().describe('The name of the project repository.'),
  language: z.string().optional().describe('The primary programming language used in the project.'),
});
export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  description: z.string().describe('A concise, one-paragraph description of the project, suitable for a portfolio.'),
});
export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;


export async function generateProjectDescription(input: GenerateProjectDescriptionInput): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateProjectDescriptionPrompt',
    input: {schema: GenerateProjectDescriptionInputSchema},
    output: {schema: GenerateProjectDescriptionOutputSchema},
    prompt: `You are an expert technical writer. Your task is to generate a concise, compelling, one-paragraph description for a software project to be featured in a developer's portfolio.

    Project Name: {{{projectName}}}
    {{#if language}}Primary Language: {{{language}}}{{/if}}
    
    Based on the project name and language, write a professional description. Focus on the project's likely purpose and potential features. The tone should be engaging and informative for a potential employer. Keep it to a single paragraph.`,
});


const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
