import type { NextPage, GetStaticProps, GetStaticPaths } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewProps {
  post: Post;
}

const PostPreview: NextPage<PostPreviewProps> = ({ post }) => {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && session.activeSubscription) {
      router.replace(`/posts/${post.slug}`);
    }
  }, [session, router, post.slug]);

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default PostPreview;

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("pos", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(
      String(response.last_publication_date)
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return {
    props: { post },
    revalidate: 60 * 30, // 30min
  };
};
