import type { GetServerSideProps } from "next";
import type { Url } from "utils/requests";
import Head from "next/head";
import { Anchor, Text, Title } from "@mantine/core";
import Shorten from "components/Shorten/Shorten";
import { getDate } from "utils/constants";
import { IdTitleStyle, IdWrapperStyle } from "styles/styles";
import { supabase } from "lib/initSupabase";

const UrlShortener = ({ data }: { data: Url }) => (
  <>
    <Head>
      <title>{`Url Sortener | ${data.destination}`}</title>
    </Head>
    <div style={IdWrapperStyle}>
      <Title order={1} style={IdTitleStyle}>
        {data.destination}
      </Title>
      <time dateTime={data.created_at} style={{ marginBottom: 16 }}>
        {getDate(data.created_at)}
      </time>
      <Shorten idOnText destination={data.destination} id={data.id} />
      <Text style={{ overflowWrap: "anywhere", marginTop: 16 }}>
        <strong>Destination:</strong>{" "}
        <Anchor href={data.destination} target="_blank" rel="noreferrer">
          {data.destination}
        </Anchor>
      </Text>
    </div>
  </>
);

export default UrlShortener;

export const getServerSideProps: GetServerSideProps = async ({ query = { id: "" }, req }) => {
  const idRegExp = /(.+)(\+)$/;
  const id = (query.id as string).replace(idRegExp, "$1");
  const { data } = await supabase.from<Url>("urls").select("*").eq("id", id);
  if (!data?.length) return { notFound: true };
  const shortenUrl = data[0];
  const shouldDisplayInfo = !!(query.id as string).match(idRegExp);
  if (shouldDisplayInfo) return { props: { data: shortenUrl } };
  return { redirect: { destination: shortenUrl.destination, permanent: false } };
};
