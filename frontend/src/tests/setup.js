import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock HTML2Canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(() => Promise.resolve({
    toDataURL: () => 'data:image/png;base64,mockimage'
  }))
}))

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    addPage: vi.fn()
  }))
}))

// Mock React Router
const mockNavigate = vi.fn()
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    Link: ({ children, to, ...props }) => {
      return `<a href="${to}" ${Object.entries(props).map(([k,v]) => `${k}="${v}"`).join(' ')}>${children}</a>`
    }
  }
})

// Mock TanStack Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: () => ({
      data: null,
      isLoading: false,
      error: null
    }),
    useMutation: () => ({
      mutate: vi.fn(),
      isLoading: false
    }),
    QueryClient: vi.fn(() => ({
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
      invalidateQueries: vi.fn()
    })),
    QueryClientProvider: ({ children }) => children
  }
})

// Mock API calls
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock console methods for cleaner test output
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn()
}