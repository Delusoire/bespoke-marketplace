import { S } from "/modules/official/stdlib/index.js";

export default function ({ onClick }: { onClick: () => void }) {
	return (
		<div onClick={onClick}>
			<p
				style={{
					fontSize: 100,
					lineHeight: "65px",
				}}
			>
				»
			</p>
			<span
				style={{
					fontSize: 20,
				}}
			>
				Load more
			</span>
		</div>
	);
}
