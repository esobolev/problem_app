export default function Loading({ hideContent = false }) {
  return (
    <div className="loading-component">
      <div className={hideContent ? 'over first' : 'over'} />
      <img src="/account/images/dest/infinity.svg" alt="loading" />
    </div>
  )
}
