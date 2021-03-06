import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, FC, useEffect, useState } from "react";
import styles from "./index.module.scss";

import { request } from "utils";
import "react-notion-x/src/styles.css";

import { defaultMapImageUrl, NotionRenderer } from "react-notion-x";
import Link from "next/link";
import Image from "next/image";
import { Code } from "react-notion-x/build/third-party/code";
import { Equation } from "react-notion-x/build/third-party/equation";
import { Modal } from "react-notion-x/build/third-party/modal";
import { Pdf } from "react-notion-x/build/third-party/pdf";
import { useColorMode } from "@chakra-ui/react";
import Error from "next/error";
import NotFound from "pages/404";
import Head from "next/head";

interface IProps {
  data: any;
}

const PostDetail: NextPage<IProps> = ({ data }): ReactElement => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const { id } = router.query;
  const [isMounted, setMount] = useState(false);

  const { title, summary } = data;
  const coverImg = defaultMapImageUrl(
    data?.signed_urls?.[id as string],
    data?.block
  ) as string;

  useEffect(() => {
    setMount(true);
  }, []);

  // TODO: 抽出cover组件
  let cover = (
    <div className={styles.cover}>
      {data?.signed_urls?.[id as string] ? (
        <Image
          src={coverImg}
          alt=""
          layout="fill"
          objectFit="cover"
          objectPosition="bottom"
        />
      ) : null}
    </div>
  );

  if (isMounted && data === null) {
    return <NotFound />;
  }

  return (
    <main className={styles.postContainer}>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.moonwillknow.dev" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={summary}
        />
        <meta name="twitter:creator" content="@chenjustcam" />
        <meta name="twitter:image"  content={coverImg} />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Moon Will Know Blog" />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://moonwillknow.dev/posts/${id}`}
        />
        <meta property="og:image" content={coverImg} />
        <meta property="og:description" content={summary} />
      </Head>
      {isMounted ? (
        <NotionRenderer
          darkMode={colorMode === "dark"}
          recordMap={data}
          fullPage={true}
          pageCover={cover}
          disableHeader
          components={{
            nextImage: Image,
            nextLink: Link,
            Code,
            Equation,
            Modal,
            Pdf,
          }}
        />
      ) : null}
    </main>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.params;
  let data = null;
  try {
    ({ data } = await request.get(`/notion/posts/${id}`));
  } catch {}

  return {
    props: {
      data,
    },
  };
}

export default PostDetail;
