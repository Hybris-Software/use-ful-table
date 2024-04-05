export default function SimpleSelect({
  items,
  value,
  setValue,
}: {
  items: string[]
  value: string | undefined
  setValue: (value: string | null) => void
}) {
  return (
    <div>
      User id:
      <select value={value} onChange={(e) => setValue(e.target.value || null)}>
        <option value={""}>---</option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  )
}
