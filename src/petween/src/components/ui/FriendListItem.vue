<template>
    <!-- FriendListItem component -->
    <div class="friend-item" @click="friendId ? handleClick() : null">
        <!-- Profile Picture -->
        <img :src="image" :alt="name" class="profile-picture" />

        <!-- Content -->
        <div class="content">
            <strong class="name">{{ displayName }}</strong>
            <span class="tags">{{ tags }}</span>
        </div>

        <!-- Arrow Icon or Slot -->
        <slot name="arrow">
          <q-icon name="chevron_right" class="arrow-icon" />
        </slot>
    </div>
</template>

<script setup lang="ts">
  // Imports
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useFriendsStore } from 'src/stores/friends-store'

  const props = defineProps<{
    image: string
    name: string
    tags: string
    friendId?: string
  }>()

  const router = useRouter()
  const friendsStore = useFriendsStore()

  // Anzeigename
  const displayName = computed(() => {
    if (props.friendId) return friendsStore.getFriendDisplayName(props.friendId, props.name)
    return props.name
  })

  // Navigation
  const handleClick = () => {
    if (props.friendId) {
      router.push({
        path: '/friend-settings',
        query: { friendId: props.friendId, name: props.name }
      })
    }
  }
</script>

<style scoped lang="scss">
/* FriendListItem styles */
.friend-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    padding: 0.75rem 1rem;
    cursor: pointer;
    width: 95%;  // Card width - can be changed
    margin: 0 auto;  // Center card
    flex: 1;  // Each card takes equal space
    
    /* Thin white separator line between each entry */
    border-bottom: 3px solid rgba(255, 255, 255, 0.2);
    
    transition: background-color 0.2s ease;
    
    &:last-child {
        border-bottom: none;  // Remove line from last element
    }
    
    &:active {
        background-color: rgba(255, 255, 255, 0.2);   // When card is pressed
    }

     .theme-info {
        margin-top: 1rem;
        font-size: 0.9rem;
        opacity: 0.75;
    }
 
}

/* Profile Picture */
.profile-picture {
    width: 50px;
    height: 50px;
    border-radius: 8px;  // Square with slightly rounded corners
    object-fit: cover;
    flex-shrink: 0;
}

/* Content */
.content {
    flex: 1;                    // Takes all available space between image and icon
    display: flex;              // Makes name and tags in a column
    flex-direction: column;     // Vertical order (name above, tags below)
    gap: 0.3rem;                // Space between name and tags
    min-width: 0;              // Allows text to shrink when needed
}
.name {
    font-size: 1rem;           // Font size
    font-weight: 400;           // Font weight (semi-bold)
    color: var(--q-text);       // Color from theme
    white-space: nowrap;        // Prevents text from wrapping to new line
    overflow: hidden;           // Hides overflow text
    text-overflow: ellipsis;    // Adds "..." for long text
}
.tags {
    font-size: 0.85rem;        // Slightly smaller than name
    opacity: 0.8;               // Slight transparency (lighter than name)
    color: var(--q-text);       // Color from theme
    white-space: nowrap;        // Prevents wrapping to new line
    overflow: hidden;           // Hides overflow text
    text-overflow: ellipsis;    // Adds "..." for long text
}

.arrow-icon {
    font-size: 1.5rem;          // Icon size
    color: var(--q-text);        // Color from theme
    opacity: 0.7;                // Medium transparency
    flex-shrink: 0;              // Never shrinks (maintains its size)
}
</style>
