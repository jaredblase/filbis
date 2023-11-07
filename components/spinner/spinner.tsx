import { HTMLAttributes } from 'react'
import styles from './spinner.module.css'

export function Spinner({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={styles['lds-ellipsis'] + (className ? ' ' + className : '')}
			{...props}
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	)
}
