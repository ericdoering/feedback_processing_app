import { Suspense, useState } from "react"
import { type DocumentHandle, useDocuments } from "@sanity/sdk-react"
import { Stack, Button, Spinner } from "@sanity/ui"

import { FeedbackPreview } from "./FeedbackPreview"
import { StatusSelector } from "./StatusSelector"
import { OnlyMine } from "./Onlymine"

type FeedbackListProps = {
  selectedFeedback: DocumentHandle | null
  setSelectedFeedback: (feedback: DocumentHandle | null) => void
}

export function FeedbackList({
  selectedFeedback,
  setSelectedFeedback,
}: FeedbackListProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [status, setStatus] = useState("all")

  const { data, hasMore, loadMore } = useDocuments({
    documentType: "feedback",
    filter: `
      select(defined($userId) => assignee == $userId, true)
      && select(
        $status == "pending" => !defined(status) || status == "pending",
        $status == "spam" => status == $status,
        $status == "approved" => status == $status,
        true
      )
    `,
    params: { userId, status },
    orderings: [{ field: "_createdAt", direction: "desc" }],
    batchSize: 10,
  })

  return (
    <Stack space={2} padding={5}>
      <StatusSelector status={status} setStatus={setStatus} />
      <OnlyMine userId={userId} setUserId={setUserId} />
      {data?.map((feedback) => {
        const isSelected = selectedFeedback?.documentId === feedback.documentId

        return (
          <Button
            key={feedback.documentId}
            onClick={() => setSelectedFeedback(feedback)}
            mode={isSelected ? "ghost" : "bleed"}
            tone={isSelected ? "primary" : undefined}
          >
            <Suspense fallback={<Spinner />}>
              <FeedbackPreview {...feedback} />
            </Suspense>
          </Button>
        )
      })}
      {hasMore && <Button onClick={loadMore} text="Load more" />}
    </Stack>
  )
}