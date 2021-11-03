## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Add new problem type

- Open folder
```
cd ./src/components/builder/problem-types/
```

- Clone skeleton folder and rename to _your_problem_type_
```
cp -r number_story your_problem_type
```

- In new folder _your_problem_type_ rename class names NumberStoryBuilder and NumberStoryViewer to your problem type names

- Add logic to files
```
viewer.tsx
```

- Add your Viewer component to
```
./src/components/builder/viewer-type-switcher.tsx
```

- Edit json data with questions in
```
./src/data/practice.tsx
```

- Check components in http://localhost:3000
