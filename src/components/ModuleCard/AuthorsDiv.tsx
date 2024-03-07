import { S } from "/modules/Delusoire/std/index.js";

interface AuthorsProps {
	authors: string[];
}
export default function ({ authors }: AuthorsProps) {
	const authorsDiv = (
		<div className="marketplace-card__authors">
			{authors.map((author, index) => (
				<a
					title={author}
					className="marketplace-card__author"
					href={author.url}
					draggable="false"
					dir="auto"
					target="_blank"
					rel="noopener noreferrer"
					onClick={e => e.stopPropagation()}
					key={index}
				>
					{author}
				</a>
			))}
		</div>
	);

	return authorsDiv;
}
