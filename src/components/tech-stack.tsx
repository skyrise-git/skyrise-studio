import DecryptText from './decrypt-text';
import { Card } from '@/components/ui/card';

const technologies = [
  {
    name: 'Rust',
    category: 'Backend',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M113.1 83.2c-3.2-1.2-13.6-6-13.6-6-3.8-.9-4.3-5.2-1.3-7.5l7.5-6.1c1-1.2 1.8-3.3 1.2-4.7-.6-1.5-2.2-2.7-3.8-2.6l-10.3.8c-4.2 0-7.8-2.2-9.6-5.8l-4-8.3s-1.5-3.3-4.8-3.3h-34c-3.3 0-4.8 3.3-4.8 3.3l-4 8.3c-1.8 3.6-5.3 5.8-9.6 5.8l-10.2-.8c-1.7-.1-3.3 1.1-3.8 2.6-.5 1.4.2 3.5 1.2 4.7l7.5 6.1c3 2.3 2.5 6.6-1.3 7.5 0 0-10.4 4.8-13.6 6-4.6 1.8-4.6 8.3 0 10.1l13.6 6c3.8.9 4.3 5.2 1.3 7.5l-7.5 6.1c-1 1.2-1.8 3.3-1.2 4.7.6 1.5 2.2 2.7 3.8 2.6l10.3-.8c4.2 0 7.8 2.2 9.6 5.8l4 8.3s1.5 3.3 4.8 3.3h34c3.3 0 4.8-3.3 4.8-3.3l4-8.3c1.8-3.6 5.3-5.8 9.6-5.8l10.2.8c1.7.1 3.3-1.1 3.8-2.6.5-1.4-.2-3.5-1.2-4.7l-7.5-6.1c-3-2.3-2.5-6.6 1.3-7.5l13.6-6c4.6-1.8 4.6-8.3 0-10.1zM64 100.2c-20 0-36.2-16.2-36.2-36.2S44 27.8 64 27.8s36.2 16.2 36.2 36.2-16.2 36.2-36.2 36.2z M64.5 35.4c-16 0-28.9 12.9-28.9 28.9s12.9 28.9 28.9 28.9 28.9-12.9 28.9-28.9-13-28.9-28.9-28.9zm-2.7 3.6h5.4v5.4h-5.4v-5.4zm-14.9 14.9H57v-5.4h-5.4v5.4h-5.4v5.4h5.4v5.4H57v-5.4h10.2v-5.4zm22.4-5.4h5.4v5.4h-5.4v-5.4zm-7.6 10.2v10.2H57v-5.4h5.4v-5.4h5.4v-5.4h5.4v5.4h5.4v5.4z"
        />
      </svg>
    ),
  },
  {
    name: 'Go',
    category: 'Backend',
    icon: (
      <svg
        role="img"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M53.9,29.33A8.45,8.45,0,0,0,52,24.2a9.42,9.42,0,0,0-5.87-5.06,10.2,10.2,0,0,0-11,.43,10.68,10.68,0,0,0-6.12,7.24,11.23,11.23,0,0,0,3.53,10.58,11.83,11.83,0,0,0,8.38,4,12.4,12.4,0,0,0,10.28-2.61L45.9,35.13a6,6,0,0,1-4.87,1.5,5.54,5.54,0,0,1-4.08-1.84,5.1,5.1,0,0,1-1.74-4.22A5.28,5.28,0,0,1,37.66,25a5.1,5.1,0,0,1,6.6-.5,4.72,4.72,0,0,1,2.4,4.12,6.46,6.46,0,0,1-.13,1.38ZM37.28,48.56a9.41,9.41,0,0,0,7.38-2.58,8.8,8.8,0,0,0,3-6.6,8.48,8.48,0,0,0-2.22-6,3.67,3.67,0,0,1,.13-2,4.16,4.16,0,0,1,2.46-3,4.38,4.38,0,0,1,4.78.2,4.74,4.74,0,0,1,2.3,4.4,4.2,4.2,0,0,1-1.25,3.19l4,3.38a9,9,0,0,0,1.9-5.49,9.41,9.41,0,0,0-4.14-8.07,10.19,10.19,0,0,0-12-1.2,10.66,10.66,0,0,0-6.6,8.59,11.25,11.25,0,0,0,1.39,7.6,11.8,11.8,0,0,0,5.78,5.77A12.39,12.39,0,0,0,37.28,48.56ZM22.5,23.41h-9v17h9v-5.5h-4v-6h4Zm-14,0h-4v17h4Z" />
      </svg>
    ),
  },
  {
    name: 'TypeScript',
    category: 'Language',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M96.7 93.3H31.2V73.6h17.8v-5.2H31.2V50.6h48.3v5.2H36.4v8h34.8l25.5-25.5V93.3zm0-61.1L74.6 54.3l22.1-22.1z" />
        <path d="M96.7 32.2L74.6 54.3v39h22.1V32.2z" />
      </svg>
    ),
  },
  {
    name: 'React',
    category: 'Frontend',
    icon: (
      <svg
        role="img"
        viewBox="0 0 184 184"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <circle cx="92" cy="92" r="24.4" />
        <path d="M165.5 69.3c-4-6.3-9.2-12-15.1-16.6-5.9-4.6-12.4-8.2-19.2-10.6-6.8-2.4-13.9-3.6-21-3.6-7.2 0-14.3.9-21.3 2.8s-13.8 4.6-20.2 8.2-12.3 8-17.6 13.1-9.9 10.8-13.8 17.1c-3.8 6.3-7 13.1-9.3 20.1-2.3 7.1-3.5 14.3-3.5 21.5s1.2 14.4 3.5 21.5 5.5 13.8 9.3 20.1c3.8 6.3 8.4 12.1 13.8 17.1s11.3 9.3 17.6 13.1 13.2 7 20.2 8.2 14.1 2.8 21.3 2.8c7.1 0 14.2-1.2 21-3.6s13.3-5.9 19.2-10.6c5.9-4.6 11.1-10.2 15.1-16.6s6.8-13.4 8.5-20.9c1.7-7.5 2.5-15.1 2.5-22.6s-.8-15.1-2.5-22.6c-1.7-7.6-4.5-14.6-8.5-20.9zm-38.3 84.5c-4.4 3.1-9.3 5.5-14.4 7.2-5.1 1.7-10.4 2.6-15.7 2.6-5.2 0-10.4-.9-15.4-2.6-5-1.7-9.8-4.1-14.2-7.2-4.4-3.1-8.3-6.9-11.6-11.3-3.3-4.4-5.8-9.3-7.5-14.5-1.7-5.2-2.5-10.6-2.5-16s.8-10.8 2.5-16c1.7-5.2 4.2-10.1 7.5-14.5s7.2-8.2 11.6-11.3c4.4-3.1 9.2-5.5 14.2-7.2 5-1.7 10.2-2.6 15.4-2.6 5.3 0 10.6.9 15.7 2.6s10 4.1 14.4 7.2c4.4 3.1 8.3 6.9 11.6 11.3s5.8 9.3 7.5 14.5c1.7 5.2 2.5 10.6 2.5 16s-.8 10.8-2.5 16c-1.7 5.2-4.2 10.1-7.5 14.5s-7.2 8.2-11.6 11.3z" />
        <path d="M92 184c-25.2 0-49-7.7-68.5-21.5l1.9-3.4c18.8 13.3 41.8 21.3 66.5 21.3s47.7-8 66.5-21.3l1.9 3.4C141 176.3 117.2 184 92 184zm-68.5-25.1C7.7 141 0 117.2 0 92c0-25.2 7.7-49 21.5-68.5l3.4 1.9C11.7 44.2 4 67.2 4 92s7.7 47.8 21.3 66.5l-3.4 1.9zm137-133.8C176.3 43 184 65.8 184 92c0 25.2-7.7 49-21.5 68.5l-3.4-1.9C172.3 139.8 180 116.8 180 92s-7.7-47.8-21.3-66.5l3.4-1.9zM92 0c25.2 0 49 7.7 68.5 21.5l-1.9 3.4C140.2 11.7 117.2 4 92 4S43.8 11.7 25.5 25.1l-1.9-3.4C43 7.7 66.8 0 92 0z" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    category: 'Backend',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M62.2 1.3L15.9 28.2c-1.3.8-2.1 2.2-2.1 3.6v59c0 1.5.8 2.9 2.1 3.6l46.3 26.9c1.3.8 2.9.8 4.2 0l46.3-26.9c1.3-.8 2.1-2.2 2.1-3.6v-59c0-1.5-.8-2.9-2.1-3.6L66.4 1.3c-1.3-.8-2.9-.8-4.2 0zM99.6 86.9c-2.4 1.6-4.5 2.7-7.2 3.9-2.2.9-4.8 1.9-7.5 1.9-3.8 0-6.7-1.1-8.5-3.3-1.6-1.9-2.5-4.8-2.5-7.9v-25.7H60.2v25.2c0 6.1 1.6 10.7 4.7 13.6 3.1 3 7.7 4.4 12.8 4.4 3.7 0 7.3-1 10.8-2.9 3.5-2 6.5-4.4 9-7.2L99.6 86.9zM51.9 33.4c-1.1-1.1-2.6-1.6-4.2-1.6-1.8 0-3.3.6-4.5 1.8-1.2 1.2-1.8 2.7-1.8 4.5 0 1.7.6 3.2 1.8 4.3 1.2 1.1 2.7 1.7 4.5 1.7s3.3-.6 4.5-1.7c1.2-1.1 1.8-2.6 1.8-4.3.1-1.8-.5-3.4-1.6-4.7z" />
      </svg>
    ),
  },
  {
    name: 'Python',
    category: 'AI/ML',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M63.7 14.3c-23 0-23.8 10.9-23.8 10.9v10.8h46.7s12-1.3 12-11.4c0-10-10-10.3-10-10.3H63.7z M64.3 113.7c23 0 23.8-10.9 23.8-10.9V92H41.4s-12 1.3-12 11.4c0 10 10 10.3 10 10.3h24.9z M92.1 63.8c0 11.5-11.1 20.3-24.3 20.3H57v-9.4h11.2c8.2 0 13.9-4.1 13.9-10.9 0-6.9-5.7-11.4-13.9-11.4H57V42h10.8c13.2 0 24.3 8.8 24.3 20.2v1.6z M35.9 64.2c0-11.5 11.1-20.3 24.3-20.3H71v9.4H59.8c-8.2 0-13.9 4.1-13.9 10.9 0 6.9 5.7 11.4 13.9 11.4H71v10.8H60.2c-13.2 0-24.3-8.8-24.3-20.2v-2z"
        />
      </svg>
    ),
  },
  {
    name: 'Kubernetes',
    category: 'DevOps',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M107.5 37.1L68.7 10.4c-2-.1-4.7 0-6.7 0L23.5 37.1c-1.3.8-2.1 2.2-2.1 3.6v42.5c0 1.5.8 2.9 2.1 3.6l38.5 26.7c1.3.8 2.9.8 4.2 0l38.5-26.7c1.3-.8 2.1-2.2 2.1-3.6V40.7c.1-1.4-.7-2.8-2-3.6zM64 87.2c-12.8 0-23.2-10.4-23.2-23.2s10.4-23.2 23.2-23.2 23.2 10.4 23.2 23.2-10.4 23.2-23.2 23.2z" />
        <path d="M64 43.3c-11.4 0-20.7 9.3-20.7 20.7s9.3 20.7 20.7 20.7 20.7-9.3 20.7-20.7-9.3-20.7-20.7-20.7zm-2.8 4.9h5.6v5.6h-5.6v-5.6zm-12.8 12.8H54v-5.6h-5.6v5.6h-5.6v5.6h5.6v5.6H54v-5.6h10v-5.6zm19.6-5.6h5.6v5.6h-5.6v-5.6zm-7.6 10v10H58.8v-5.6h5.6v-5.6H69v-5.6h5.6v5.6H80v5.6z" />
      </svg>
    ),
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M102.7 11.2H25.3c-1.8 0-3.3 1.5-3.3 3.3v99c0 1.8 1.5 3.3 3.3 3.3h53.5V86.7H50.5V60.9h28.3v-19H50.5V22h52.2v92.5h0zM78.8 116.8h23.9V11.2h0z" />
        <path d="M50.5 73.8h17.9v-7.7H50.5z" />
      </svg>
    ),
  },
  {
    name: 'gRPC',
    category: 'Comms',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M37.8 37.8c-10.5 10.5-10.5 27.6 0 38.1l11.6-11.6c-4-4-4-10.4 0-14.4l14.4-14.4c4-4 10.4-4 14.4 0l11.6-11.6C90.4 27.3 75.6 27.3 64 39c-3.7 3.6-6.3 8-7.6 12.9L37.8 33.2c-1-1.3-2.3-2.3-3.8-2.9l-1.3-1.3c-1.8-1.8-4.1-2.8-6.6-2.8H11.8c-2.3 0-4.4 1-5.9 2.6L2.6 31.9c-1.6 1.6-2.6 3.6-2.6 5.9v14.4c0 2.6 1 5 2.8 6.6l1.3 1.3c.6 1.5 1.6 2.8 2.9 3.8l18.7 18.7c1.3 1 2.6 1.9 4.1 2.5l1.3 1.3c1.8 1.8 4.1 2.8 6.6 2.8h14.4c2.3 0 4.4-1 5.9-2.6l3.3-3.3c1.6-1.6 2.6-3.6 2.6-5.9V74.4c0-2.6-1-5-2.8-6.6l-1.3-1.3c-4.8-1.3-9.2-3.9-12.9-7.6 3.7-3.7 3.7-9.8 0-13.5L37.8 37.8z M116.2 26.3c-1.5-.6-2.8-1.6-3.8-2.9L93.7 4.7c-1.3-1-2.5-1.9-4.1-2.5L88.3.9C86.5-.9 84.1-.9 81.5-.9H67.2c-2.3 0-4.4 1-5.9 2.6L58 5.9c-1.6 1.6-2.6 3.6-2.6 5.9v14.4c0 2.6 1 5 2.8 6.6l1.3 1.3c4.8 1.3 9.2 3.9 12.9 7.6-3.7 3.7-3.7 9.8 0 13.5l7.9 7.9c10.5-10.5 10.5-27.6 0-38.1L92.2 30c4-4 4-10.4 0-14.4L77.8 1.2c-4-4-10.4-4-14.4 0L51.8 13.2C41.3 23.7 41.3 38.4 53 50.1l11.6 11.6c10.5 10.5 27.6 10.5 38.1 0l11.6-11.6c10.5-10.5 10.5-27.6 0-38.1l-.8-.8z M54.1 73.9c-10.5 10.5-10.5 27.6 0 38.1l-.8.8c10.5 10.5 27.6 10.5 38.1 0l11.6-11.6c10.5-10.5 10.5-27.6 0-38.1l-11.6-11.6c-10.5-10.5-27.6-10.5-38.1 0L54.1 73.9zm-3.8-2.9L31.6 92.2c-1 1.3-1.9 2.6-2.5 4.1l-1.3 1.3c-1.8 1.8-2.8 4.1-2.8 6.6v14.4c0 2.3 1 4.4 2.6 5.9l3.3 3.3c1.6 1.6 3.6 2.6 5.9 2.6h14.4c2.6 0 5-1 6.6-2.8l1.3-1.3c1.5-.6 2.8-1.6 3.8-2.9L92.2 96.4c1.3-1 2.3-2.3 2.9-3.8l1.3-1.3c1.8-1.8 2.8-4.1 2.8-6.6V70.4c0-2.3-1-4.4-2.6-5.9l-3.3-3.3c-1.6-1.6-3.6-2.6-5.9-2.6H67.2c-2.6 0-5 1-6.6 2.8l-1.3 1.3c-.6 1.5-1.6 2.8-2.9 3.8z M13.2 51.8c10.5-10.5 27.6-10.5 38.1 0L39.7 63.4c-4 4-4 10.4 0 14.4l14.4 14.4c4 4 10.4 4 14.4 0l11.6 11.6c-10.5 10.5-27.6 10.5-38.1 0L27.3 90.4c-10.5-10.5-10.5-27.6 0-38.1l11.6-11.6c-11.7-11.7-26.4-11.7-38.1 0L.9 51.8c-1.8 1.8-1.8 4.7 0 6.6l12.3 12.3c1.8 1.8 4.7 1.8 6.6 0L42.2 58.3c4.8-4.8 4.8-12.6 0-17.4l-15.6-15.6c-4.8-4.8-12.6-4.8-17.4 0l-3.2 3.2c-.9.9-1.4 2.1-1.4 3.4s.5 2.5 1.4 3.4l.2.2z"
        />
      </svg>
    ),
  },
  {
    name: 'GraphQL',
    category: 'API',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M64 1.3L15.9 28.2c-1.3.8-2.1 2.2-2.1 3.6v59c0 1.5.8 2.9 2.1 3.6l46.3 26.9c1.3.8 2.9.8 4.2 0l46.3-26.9c1.3-.8 2.1-2.2 2.1-3.6v-59c0-1.5-.8-2.9-2.1-3.6L66.4 1.3c-1.3-.8-2.9-.8-4.2 0zM35.6 57.8c0-15.7 12.8-28.5 28.5-28.5s28.5 12.8 28.5 28.5-12.8 28.5-28.5 28.5-28.5-12.8-28.5-28.5zm3.7.1c0 13.7 11.1 24.8 24.8 24.8s24.8-11.1 24.8-24.8-11.1-24.8-24.8-24.8-24.8 11.1-24.8 24.8z" />
        <circle cx="64.1" cy="18.9" r="6.1" />
        <circle cx="28.9" cy="40.7" r="6.1" />
        <circle cx="28.9" cy="75.6" r="6.1" />
        <circle cx="64.1" cy="98.1" r="6.1" />
        <circle cx="99.2" cy="75.6" r="6.1" />
        <circle cx="99.2" cy="40.7" r="6.1" />
      </svg>
    ),
  },
  {
    name: 'WebAssembly',
    category: 'Core',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M64.01 12.8l-44.4 25.61v51.2l44.4 25.6 44.4-25.6v-51.2L64.01 12.8zM43.91 80.51l-4.5-8.2 16.9-29.4h9l16.9 29.4-4.5 8.2-12.3-21.4-12.4 21.4zm44.2-29.4h-9l-5.1 8.9-5.2-8.9h-9l14.2 24.3v13.3h9V75.41l14.1-24.3z" />
      </svg>
    ),
  },
  {
    name: 'Solidity',
    category: 'Blockchain',
    icon: (
      <svg
        role="img"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-foreground opacity-50 group-hover:opacity-100 transition-opacity"
        fill="currentColor"
      >
        <path d="M39.3 38.4l44.5-25.6v102.5l-44.5-25.6V38.4zm44.5 76.8V64l39.9 22.9v-8.1L83.8 55.9v-8.1l39.9 22.9v-8.1L83.8 39.6V18.1l39.9 23v45.9l-39.9 28.3z" />
      </svg>
    ),
  },
];

export default function TechStack() {
  return (
    <section className="container mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl">Core Technologies</h2>
        <p className="text-muted-foreground font-code mt-2">Our arsenal for building the future.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4 max-w-6xl mx-auto">
        {technologies.map((tech, index) => (
          <Card key={tech.name} className="group aspect-square p-4 flex flex-col justify-between border-white/5 bg-white/5 hover:border-primary/50 transition-colors duration-300">
            <div className="flex justify-between items-start">
              {tech.icon}
              <span className="font-code text-xs text-muted-foreground">{index.toString().padStart(2, '0')}</span>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-headline tracking-wide">
                <DecryptText text={tech.name} />
              </h3>
              <p className="text-xs text-muted-foreground font-code">{tech.category}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
