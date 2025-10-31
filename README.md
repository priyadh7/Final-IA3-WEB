# WealthWatch — Full‑Stack Expense Tracker (DevOps Demo)

Version: 1.0 — Last updated: 25 Oct 2025

Short summary
- WealthWatch is a full‑stack Expense Tracker: React + Vite frontend and Node.js + TypeScript backend.  
- This repository is prepared for DevOps assessment: local dev (docker‑compose), containerization, Kubernetes manifests, and CI pipeline scaffold.

Repository layout
- /client — React + Vite frontend (App.tsx, pages, components)
- /server — Node.js + TypeScript backend (index.ts, routes.ts, storage.ts, middleware/)
- /k8s — Kubernetes manifests (backend, frontend, mongo, secrets)
- /.github/workflows/ci-cd.yml — GitHub Actions pipeline (build, push, optional deploy)
- /docker-compose.yml — local multi-service dev stack
- /README.md — this file

Prerequisites (macOS)
- Homebrew, Node.js 18+, Docker Desktop (includes docker-compose), kubectl (optional), minikube/kind/EKS (optional), git.

Local quickstart (recommended)
1. Clone:
   - git clone <repo-url>
   - cd WealthWatch

2. Server env (example)
   - Create server/.env from the example below:
     MONGO_URI=mongodb://mongo:27017/expenses
     PORT=5000
     NODE_ENV=development

3. Client env (if needed)
   - No required env file for local static build; use default API url in client config or create client/.env if present.

4. Start local stack:
   - docker compose up --build
   - Frontend: http://localhost:3000
   - Backend:  http://localhost:5000
   - Mongo:    mongodb://localhost:27017 (used by backend inside compose)

Stop:
   - docker compose down -v

Run services independently (dev)
- Backend (dev mode with hot reload):
  - cd server
  - npm ci
  - npm run dev   # if script exists (ts-node/ts-node-dev)
- Frontend (Vite dev server):
  - cd client
  - npm ci
  - npm run dev

Build images (production)
- docker build -t <username>/expense-backend:latest ./server
- docker build -t <username>/expense-frontend:latest ./client
- docker login
- docker push <username>/expense-backend:latest
- docker push <username>/expense-frontend:latest

Kubernetes (basic demo)
1. Ensure cluster and kubectl access (minikube/kind/EKS).
2. Replace image placeholders in /k8s/*.yaml with your registry images.
3. kubectl apply -f k8s/
4. Verify:
   - kubectl get pods,svc
   - minikube service expense-frontend-svc --url (if using minikube)

CI/CD (GitHub Actions)
- Workflow: .github/workflows/ci-cd.yml
- Required repo secrets: DOCKER_USERNAME, DOCKER_PASSWORD
- Optional: KUBE_CONFIG (base64 kubeconfig) to enable automatic kubectl apply step

Environment examples
- server/.env.example:
  MONGO_URI=mongodb://mongo:27017/expenses
  PORT=5000
  NODE_ENV=production

Testing & quality (recommended)
- Add Jest for server unit tests and React Testing Library for client.
- Add ESLint + Prettier and run checks in CI.
- Add GitHub CodeQL or Snyk for security scanning.

Assessment evidence checklist
- Git history with meaningful commits (link)
- GitHub Actions run(s) (screenshots or links)
- Docker images pushed (DockerHub/GHCR) with tags
- kubectl get pods/services output (screenshot)
- docker-compose logs or Terraform/Ansible outputs if used

Next recommended steps (pick one)
- Add unit & e2e tests and CI test steps
- Create Helm chart + PVCs + Ingress with TLS
- Replace mongo emptyDir with PVC and add backup docs
- Add Prometheus/Grafana instrumentation

License
- Add LICENSE (MIT recommended for portfolio)

Contact / submission
- Include links to repo, Actions runs, image registry and any cloud console resources used. Provide a short demo script (5 steps) for the assessor.