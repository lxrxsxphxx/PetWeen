<script setup lang="ts">
/**
 * FriendListItem
 *
 * A reusable list row to display a friend with avatar, name, and tags.
 * Used on the Friends overview, New Requests, and Blocked Friends dialogs.
 */

const props = withDefaults(
  defineProps<{
    image: string
    name: string
    tags: string
    clickable?: boolean
  }>(),
  {
    clickable: true,
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  if (!props.clickable) return
  emit('click')
}
</script>

<template>
  <div class="friend-item" :class="{ 'friend-item--clickable': clickable }" @click="handleClick">
    <div class="friend-left">
      <img :src="image" :alt="name" class="avatar" />

      <div class="text">
        <p class="name">{{ name }}</p>
        <p class="tags">{{ tags }}</p>
      </div>
    </div>

    <div class="friend-right">
      <slot name="arrow">
        <q-icon 
          name="chevron_right" 
          class="chevron" 
        />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.friend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.9rem 0.95rem;
  color: var(--q-text);

  /* Separator line between items (container should hide overflow) */
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.friend-item--clickable {
  cursor: pointer;
}

.friend-item--clickable:active {
  opacity: 0.85;
}

.friend-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0; /* allow ellipsis */
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: white;
  object-fit: cover;
  flex-shrink: 0;
}

.text {
  min-width: 0;
}

.name {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags {
  margin: 0.15rem 0 0;
  font-size: 0.9rem;
  opacity: 0.75;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.friend-right {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  flex-shrink: 0;
}

.chevron {
  font-size: 1.8rem;
  opacity: 0.9;
}

/* Remove last separator when used in a list */
.friend-item:last-child {
  border-bottom: none;
}
</style>
