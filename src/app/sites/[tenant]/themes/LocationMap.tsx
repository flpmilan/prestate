export function LocationMap({
  address,
  name,
  frameClassName,
}: {
  address: string;
  name: string;
  frameClassName: string;
}) {
  const query = encodeURIComponent(`${name}, ${address}`);
  const src = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <div className={`h-[360px] w-full ${frameClassName}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${name} térkép`}
      />
    </div>
  );
}
