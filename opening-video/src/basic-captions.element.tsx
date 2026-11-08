import type {Caption} from '@remotion/captions';
import {createTikTokStyleCaptions} from '@remotion/captions';
import React, {useMemo} from 'react';
import {
	Interactive,
	useCurrentFrame,
	useVideoConfig,
	type InteractiveTransformProps,
	type InteractivitySchema,
	type SequenceProps,
} from 'remotion';

type BasicCaptionsProps = InteractiveTransformProps &
	Pick<SequenceProps, 'width'> & {
		readonly captions: Caption[];
		readonly combineTokensWithinMilliseconds?: number;
	};

const defaultCombineTokensWithinMilliseconds = 3000;
const defaultWidth = 900;

const basicCaptionsSchema = {
	...Interactive.captionsSchema,
	width: {
		type: 'number',
		min: 1,
		step: 1,
		default: undefined,
		description: 'Caption area width',
		hiddenFromList: false,
	},
	combineTokensWithinMilliseconds: {
		type: 'number',
		min: 0,
		step: 50,
		default: defaultCombineTokensWithinMilliseconds,
		description: 'Time between caption pages',
		hiddenFromList: false,
	},
} as const satisfies InteractivitySchema;

const BasicCaptionsContent: React.FC<BasicCaptionsProps> = ({
	captions,
	combineTokensWithinMilliseconds = defaultCombineTokensWithinMilliseconds,
	style,
	width = defaultWidth,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const pages = useMemo(
		() =>
			createTikTokStyleCaptions({
				captions,
				combineTokensWithinMilliseconds,
			}).pages,
		[captions, combineTokensWithinMilliseconds],
	);
	const currentTimeMs = (frame / fps) * 1000;
	const page = pages.find(
		(candidate) =>
			currentTimeMs >= candidate.startMs &&
			currentTimeMs < candidate.startMs + candidate.durationMs,
	);

	return (
		<div
			style={{
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'center',
				width,
				...style,
			}}
		>
			{page ? (
				<div
					style={{
						backgroundColor: 'rgba(0, 0, 0, 0.55)',
						borderRadius: 8,
						color: '#ffffff',
						fontFamily:
							'Presentation Inter, Inter, Arial, Helvetica, sans-serif',
						fontSize: 64,
						fontWeight: 500,
						lineHeight: 1.25,
						padding: '16px 26px',
						textAlign: 'center',
						textWrap: 'balance',
						whiteSpace: 'pre-wrap',
					}}
				>
					{page.text.trim()}
				</div>
			) : null}
		</div>
	);
};

export const BasicCaptions = Interactive.create({
	Component: BasicCaptionsContent,
	componentName: '<BasicCaptions>',
	schema: basicCaptionsSchema,
});
