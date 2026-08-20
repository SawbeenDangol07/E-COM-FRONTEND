export const RowSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <>
      {[...Array(rows)].map((_, index) => (
        <tr key={index} className="border-b border-slate-100 animate-pulse">
          {[...Array(columns)].map((_, ind) => (
            <td key={`col-${ind}`} className="px-5 py-4">
              <div className="h-4 bg-slate-200 rounded-lg w-full max-w-[140px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default RowSkeleton;
