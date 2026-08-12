import Toggle from '../../../components/ui/Toggle'

export default function NotificationToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-surface px-[18px] py-2.5 shadow-[0px_1px_8px_0px_#00000026]">
      <div className="flex flex-col">
        <span className="text-[14px] font-medium leading-[120%] text-on-background">{title}</span>
        <span className="mt-1 text-[12px] font-medium leading-[180%] text-outline">{description}</span>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}