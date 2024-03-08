export default function SimpleSelect({
  items,
  value,
  setValue,
}: {
  items: string[]
  value: string
  setValue: (value: string) => void
}) {
  return (
    <select value={value} onChange={(e) => setValue(e.target.value)}>
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  )
}
