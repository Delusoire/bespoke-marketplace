import { S } from "/modules/official/stdlib/index.js";

interface AuthorsProps {
	authors: string[];
}
export default function ({ authors }: AuthorsProps) {
	return (
		<div className="">
			{authors.map((author, index) => (
				<a
					title={author}
					className="marketplace-card__author"
					href={`https://github.com/${author}`}
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
}
