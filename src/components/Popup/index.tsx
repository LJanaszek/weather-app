import style from "@/styles/popup.module.scss"
type PopupProps = {
    children: React.ReactNode
}
export default function Popup({ children }: PopupProps) {
    return <div className={style.popup}>
        <div className={style.inner}>
            {children}
        </div>
    </div>;
}