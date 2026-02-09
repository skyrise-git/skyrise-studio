import DecryptText from './decrypt-text';
import { Card } from '@/components/ui/card';

const technologies = [
  { name: 'Rust', category: 'Backend', symbol: 'Ru' },
  { name: 'Go', category: 'Backend', symbol: 'Go' },
  { name: 'TypeScript', category: 'Language', symbol: 'Ts' },
  { name: 'React', category: 'Frontend', symbol: 'Re' },
  { name: 'Node.js', category: 'Backend', symbol: 'Nd' },
  { name: 'Python', category: 'AI/ML', symbol: 'Py' },
  { name: 'Kubernetes', category: 'DevOps', symbol: 'K8s' },
  { name: 'PostgreSQL', category: 'Database', symbol: 'Pg' },
  { name: 'gRPC', category: 'Comms', symbol: 'gR' },
  { name: 'GraphQL', category: 'API', symbol: 'GQL' },
  { name: 'WebAssembly', category: 'Core', symbol: 'Wasm' },
  { name: 'Solidity', category: 'Blockchain', symbol: 'Sol' },
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
              <span className="font-code text-3xl font-bold text-primary-foreground">{tech.symbol}</span>
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
