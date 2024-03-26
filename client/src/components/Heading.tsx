interface IHeading {
  title: string;
  cssClass?: string;
}

export default function Heading({ title, cssClass }: IHeading) {
  return (
    <h1 className={`font-bold text-3xl ${cssClass ? cssClass : ""}`}>
      <span className="bg-gradient-to-r from-pink-400 via-red-500 to-orange-500 text-transparent bg-clip-text">
        {title}
      </span>
    </h1>
  );
}
