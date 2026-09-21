import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const WORKING_DIR = '/workspace'; // this is the working directory, because it is the only folder that is accessible to this agent and also the container

const app = express();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Sandbox agent!!',
    status: 'success',
  });
});

app.get('/list-files', async (req, res) => {
  const elements = await fs.promises.readdir(WORKING_DIR);
  return res.status(200).json({
    message: 'Elements in working directory',
    elements,
  });
});

/**
 * @route GET /read-files
 * @description Reads the content of all files specified in the query parameter 'files' and returns their content as a JSON object.
 * - eg. /read-files?files=file1.txt,/src/file2.txt
 */
// With this API, when we send the names/paths of files in the files query parameter, the server reads those files and returns their contents as JSON.

app.get('/read-files', async (req, res) => {
  const files = req.query.files;

  if (!files) {
    return res.status(400).json({
      message: 'No files specified in query parameter',
      status: 'error',
    });
  }

  const fileList = files.split(',');

  const results = await Promise.all(
    fileList.map(async (file) => {
      const filePath = `${WORKING_DIR}/${file}`;
      try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return { [filePath]: content };
      } catch (error) {
        return { [filePath]: `Error reading file: ${error.message}` };
      }
    })
  );

  return res.status(200).json({
    message: 'Files read successfully',
    files: results,
  });
});

/**
 * @route PATCH /update-files
 * @description Updates the content of files specified in the request body. The request body should contain a property 'updates' with a JSON Array of object, each object should have a 'file' property specifying the file path (relative to the working directory) and a 'content' property specifying the new content for the file.
 * - eg. /update-files
 */
// This API allows the client to update the contents of one or more existing files by sending their file paths and new content in the request body.

app.patch('/update-files', async (req, res) => {
  const updates = req.body.updates;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({
      message:
        'Invalid request body. Expected a JSON object with an "updates" property containing an array of file updates.',
      status: 'error',
    });
  }

  const results = await Promise.all(
    updates.map(async (update) => {
      const { file, content } = update;
      const filePath = path.join(WORKING_DIR, file);

      try {
        await fs.promises.writeFile(filePath, content, 'utf-8');
        return {
          [filePath]: 'File updated successfully',
        };
      } catch (err) {
        return {
          [filePath]: `Error updating file: ${err.message}`,
        };
      }
    })
  );

  res.status(200).json({
    message: 'Files updated successfully',
    results,
  });
});

/**
 * @route POST /create-files
 * @description Creates new files with the content specified in the request body. The request body should contain a property 'files' with a JSON Array of objects, each object should have a 'file' property specifying the file path (relative to the working directory) and a 'content' property specifying the content for the new file.
 */
// This API allows the client to create new files by sending their file paths and content in the request body.

app.post('/create-files', async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: 'Invalid request body. Expected a JSON object with a "files" property containing an array of file contents.',
            status: 'error',
        });
    }

    const results = await Promise.all(
        files.map(async (fileObj) => {
            const { file, content } = fileObj;
            const filePath = path.join(WORKING_DIR, file);

            try {
                await fs.promises.writeFile(filePath, content, 'utf-8');
                return {
                    [filePath]: 'File created successfully',
                };
            } catch (err) {
                return {
                    [filePath]: `Error creating file: ${err.message}`,
                };
            }
        })
    );

    return res.status(200).json({
        message: 'Files created successfully',
        results,
    });
});




export default app;
