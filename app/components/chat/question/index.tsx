'use client'
import type { FC } from 'react'
import React from 'react'
import type { IChatItem } from '../type'
import s from '../style.module.css'

import StreamdownMarkdown from '@/app/components/base/streamdown-markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type IQuestionProps = Pick<IChatItem, 'id' | 'content' | 'useCurrentUserAvatar'> & {
  imgSrcs?: string[]
}

const Question: FC<IQuestionProps> = ({ id, content, useCurrentUserAvatar, imgSrcs }) => {
  const userName = ''
  return (
    <div className='flex min-w-0 items-start justify-end' key={id}>
      <div className='min-w-0 max-w-[calc(100%-2.5rem)] sm:max-w-[calc(100%-3rem)]'>
        <div className={`${s.question} relative text-sm text-gray-900`}>
          <div
            className={'question-bubble mr-2 max-w-full break-words rounded-tl-2xl rounded-b-2xl bg-blue-500 px-3.5 py-2.5 sm:px-4 sm:py-3'}
          >
            {imgSrcs && imgSrcs.length > 0 && (
              <ImageGallery srcs={imgSrcs} />
            )}
            <StreamdownMarkdown content={content} />
          </div>
        </div>
      </div>
      {useCurrentUserAvatar
        ? (
          <div className='h-8 w-8 shrink-0 rounded-full bg-primary-600 text-center leading-8 text-white sm:h-10 sm:w-10 sm:leading-10'>
            {userName?.[0].toLocaleUpperCase()}
          </div>
        )
        : (
          <div className={`${s.questionIcon} h-8 w-8 shrink-0 sm:h-10 sm:w-10`}></div>
        )}
    </div>
  )
}

export default React.memo(Question)
