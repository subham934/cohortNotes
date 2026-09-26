import axios from 'axios';
import { tool } from 'langchain';
import * as z from 'zod';

export const listFiles = tool(
  async ({}) => {
    const response = await axios.get(
      'http://01a0d419-63d1-715b-9021-a2a34f279613.agent.localhost/list-files' // we will hit this API to list all the files in container
    );
    return JSON.stringify(response.data.files); // we return files
  },

  {
    name: 'list_files',
    description:
      'List all the files in the project directory. This is useful for understanding what files are available to work with.',
    schema: z.object({}), // we also need to define a schema so that what kind of data our tool expects, and for that we use `npm i zod`, and then we define the schema of the tool.
  }
);

export const readFiles = tool(
  async ({ files: [] }) => {
    const response = await axios.post(
      `http://01a0d419-63d1-715b-9021-a2a34f279613.agent.localhost/read-files?files=` +
        files.join(',') // we will hit this API to read all the files in container
    );
    return JSON.stringify(response.data); // we return files
  },
  {
    name: 'read_files',
    description:
      'Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.',
    schema: z.object({
      files: z
        .array(z.string())
        .describe(
          'The list of files absolute paths to read. These should be files that were listed using the list_files tool or created later'
        ),
    }),
  }
);

export const updateFiles = tool(async ({ files }) => {
  const response = await axios.patch(
    `http://01a0d419-63d1-715b-9021-a2a34f279613.agent.localhost/update-files`,
    {
      updates: files,
    }
  );

  return JSON.stringify(response.data.results);
},
{
        name: "update_files",
        description: "Update the contents of specified files. This is useful for making changes to files based on the requirements of the task at hand. this tool can also use to create new files by providing a new file name in the file field and the content to be added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
});




