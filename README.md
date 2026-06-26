# Varman

## Phase 1: Backend Foundation (Completed)
We successfully transitioned from the legacy AMOR system to the Varman architecture. Today's work on the Phase 1 backend foundation involved:
- **Clean Project Structure**: Set up the `app/` directory with a streamlined configuration via `pydantic_settings`.
- **Database Initialization**: Implemented an async SQLAlchemy 2.0 engine with connection pooling and a startup hook for automatic table creation. Added the `User` and `ProtectedImage` models using UUIDs and fully mapped fields tracking the lifecycle of adversarial processing.
- **Upload Guards**: Built a strict asynchronous file validation module using PIL verification and memory-safe streaming to handle image uploads securely.
- **Robustness**: Rewired the FastAPI lifespan hook to gracefully handle missing PostgreSQL connections for easy frontend development without an active DB.
- **Dependency Cleanup**: Cleared out outdated dependencies (e.g., legacy scrapers) and updated `requirements.txt` to align strictly with the VRAM-safe, asynchronous EoT execution model defined for Varman.
- **Old AMOR Cleanup**: Removed colliding files from the old `amor-backend` while retaining potentially useful utilities like the `.caffemodel` weights for Phase 3. Leftover `venv` files were cleared to prevent dependency collisions.

---

# React + Vite (Frontend Template)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
