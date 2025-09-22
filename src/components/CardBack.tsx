interface CardBackProps {
  style?: string;
}

export default function CardBack({ style }: CardBackProps) {
  return (
    <section
      className="aspect-[58/89] w-full rounded-lg bg-white p-2 shadow"
      style={style ? { viewTransitionName: style } : undefined}
    >
      <div className="h-full w-full rounded bg-red-700"></div>
    </section>
  );
}