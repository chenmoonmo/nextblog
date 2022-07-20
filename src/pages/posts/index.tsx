import { Skeleton, Tag, TagLabel } from '@chakra-ui/react'
import { useMount, useUpdateEffect } from 'ahooks'
import { PostCard } from 'components'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { getpostsListData } from 'slices/posts'
import { useAppDispatch, useAppSelector } from 'utils'

import styles from './index.module.scss'

import { uniq, intersection, remove, cloneDeep } from 'lodash'

const Posts: NextPage = (): ReactElement => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, list } = useAppSelector((state) => state.posts)

  const tags = useAppSelector((state) => {
    return list?.reduce((pre, cur) => {
      if (cur.tags) {
        pre.push(...cur.tags)
        pre = uniq(pre)
      }
      return pre
    }, [])
  })

  const [currentTags, setTags] = useState<string[]>(tags)

  const handleToPosts = (id: string) => {
    router.push(`/posts/${id}`)
  }

  const handleFilte = (item: string) => {
    if (currentTags.includes(item)) {
      setTags((preTags) => {
        let cloneTags = cloneDeep(preTags)
        remove(cloneTags, (x) => x === item)
        return cloneTags
      })
    } else {
      setTags((preTags) => {
        return [...preTags, item]
      })
    }
  }

  useMount(() => {
    dispatch(getpostsListData())
  })

  useUpdateEffect(() => {
    setTags(tags)
  }, [tags])

  return (
    <main className={styles.container}>
      <div className={styles.tags}>
        {tags?.map((item: string) => (
          <Tag
            className={styles.tag}
            key={item}
            size="sm"
            colorScheme={currentTags?.includes(item) ? 'messenger' : 'gray'}
            onClick={() => handleFilte(item)}
          >
            <TagLabel>{item}</TagLabel>
          </Tag>
        ))}
      </div>
      <div className={styles.postsContainer}>
        {isLoading ? (
          <>
            <Skeleton height={180}></Skeleton>
            <Skeleton height={180}></Skeleton>
            <Skeleton height={180}></Skeleton>
            <Skeleton height={180}></Skeleton>
            <Skeleton height={180}></Skeleton>
            <Skeleton height={180}></Skeleton>
          </>
        ) : (
          list
            ?.filter((item) => {
              return intersection(item.tags, currentTags).length > 0
            })
            ?.map((data: any) => (
              <PostCard key={data.id} data={data} onClick={handleToPosts} />
            ))
        )}
      </div>
    </main>
  )
}

export default Posts
