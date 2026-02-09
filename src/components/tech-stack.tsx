import DecryptText from './decrypt-text';
import { Card } from '@/components/ui/card';

const technologies = [
  {
    name: 'Rust',
    category: 'Backend',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-plain.svg"
        alt="Rust logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'Go',
    category: 'Backend',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg"
        alt="Go logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'TypeScript',
    category: 'Language',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
        alt="TypeScript logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'React',
    category: 'Frontend',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
        alt="React logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'Node.js',
    category: 'Backend',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
        alt="Node.js logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'Python',
    category: 'AI/ML',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
        alt="Python logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'Kubernetes',
    category: 'DevOps',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg"
        alt="Kubernetes logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg"
        alt="PostgreSQL logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'gRPC',
    category: 'Comms',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grpc/grpc-original.svg"
        alt="gRPC logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'GraphQL',
    category: 'API',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg"
        alt="GraphQL logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'WebAssembly',
    category: 'Core',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webassembly/webassembly-original.svg"
        alt="WebAssembly logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
    ),
  },
  {
    name: 'Solidity',
    category: 'Blockchain',
    icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg"
        alt="Solidity logo"
        className="w-12 h-12 opacity-50 group-hover:opacity-100 transition-opacity"
      />
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
