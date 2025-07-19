import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageBySlug } from '../../../components/backendApis/admin/apis/page';

const Page = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);

  // Option 1: Convert plain text to HTML-safe format
  const formatPlainTextToHTML = (text) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(/\n/g, '<br/>');
  };

  useEffect(() => {
    const fetchPage = async () => {
      const res = await getPageBySlug(slug);
      if (res.success) {
        setPageData(res.data);
      }
    };

    fetchPage();
  }, [slug]);

  return (
    <div className="px-4 py-10 mt-10 pc:mt-20 tab:mt-16 mobile:mt-12">
      {pageData?.title && (
        <h1
          className="
            font-bold 
            text-primary-600 
            mb-6 
            text-[30px] 
            pc:text-[32px] 
            tab:text-[26px] 
            mobile:text-[22px]
          "
        >
          {pageData.title}
        </h1>
      )}

      {pageData?.content && (
        <div
          className="
            prose 
            max-w-none 
            pc:prose-lg 
            tab:prose-base 
            mobile:prose-sm
          "
          dangerouslySetInnerHTML={{ __html: formatPlainTextToHTML(pageData.content) }}
        />
      )}
    </div>
  );
};

export default Page;
