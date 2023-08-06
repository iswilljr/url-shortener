'use client'

import axios from 'redaxios'
import useSWRMutate from 'swr/mutation'
import { mutate } from 'swr'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { LINKS_DATA_KEY } from '@/config/constants'
import { useWithinDrawer } from '@/hooks/use-within-drawer'
import { CreateLinkDialog } from '../dialogs/create-link'
import type { Link } from '@/utils/schemas'

interface CreateLinkFormProps {
  initialValues?: Link
  open?: boolean
  trigger?: React.ReactNode
  onOpenChange?: (value: boolean) => void
}

export function CreateLinkForm({ initialValues, open, trigger, onOpenChange }: CreateLinkFormProps) {
  const { modalOpen, onModalOpenChange } = useWithinDrawer({ open, onOpenChange })
  const { trigger: create } = useSWRMutate('create-link', (_key, { arg }: { arg: Link }) =>
    axios.post(`/api/link/${arg.key}`, arg)
  )

  const createLink = useCallback(
    async (data: Link) => {
      await create(data)
      await mutate(LINKS_DATA_KEY)
      toast.success('Link created successfully.')
    },
    [create]
  )

  return (
    <CreateLinkDialog
      trigger={trigger}
      open={modalOpen}
      onSubmit={createLink}
      onOpenChange={onModalOpenChange}
      initialValues={initialValues}
    />
  )
}
