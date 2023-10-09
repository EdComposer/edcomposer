<p align="center">
  <a href="https://github.com/edcomposer">
    <h2 align="center">EdComposer Video Generator</h2>
  </a>
</p>

<p align="center">🦄 AI for Education: Quickly create engaging short videos for learning concepts</p>

## 📦 Features

- ⚡️ **NextJS 13** - Uses all the bleeding-edge features of NextJS 13
  - 🌈 **Server Actions** - APIs are abstracted, invoke and poll renders with typesafety
  - 📁 **App Directory** - Create layouts and new pages delightfully
- 🎨 **TailwindCSS** - Uses TailwindCSS for styling app and videos
- ƛ **Remotion Lambda** - Uses Remotion Lambda for rendering videos at scale
- 📱 **Supports Multiple Video Dimensions** - Change the aspect ratio of your videos using the app
- 📦 **Fully-Featured** - Uses all the features of Remotion
- 📝 **TypeScript+Validation** - Uses TypeScript for type safety and Zod for validation

## 🚀 Quickstart

### 1. Generate a repo using this template

Use `git clone`

### 2. Install dependencies

```bash
pnpm add
```

### 3. Create `.env` file

Copy the `.env.example` file to `.env` and fill in the values.

```config
REMOTION_AWS_ACCESS_KEY_ID=<Your AWS Access Key ID>
REMOTION_AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>
```

### 4. Deploy lambda

```bash
pnpm run lambda:site
pnpm run lambda:function
```

### 5. Start the app

```bash
pnpm run dev
```

This will start the app on [http://localhost:3000](http://localhost:3000).


## 🌄 Inspiration
- [Remotion's NextJS Template](https://github.com/remotion-dev/template-next/)
